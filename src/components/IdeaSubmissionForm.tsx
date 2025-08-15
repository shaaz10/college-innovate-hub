import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Upload, X, UserPlus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { stageLabels } from "@/data/mockData";
import { ideasAPI, problemsAPI } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

interface TeamMember {
  name: string;
  email: string;
  role: string;
  image: File | null;
}

interface IdeaFormData {
  title: string;
  description: string;
  problemId: string;
  stage: number;
  mentor: string;
  contact: string;
  teammates: TeamMember[];
}

const IdeaSubmissionForm = () => {
  const [open, setOpen] = useState(false);
  const [teamImagePreviews, setTeamImagePreviews] = useState<{ [key: number]: string }>({});
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  
  // Fetch problems for dropdown
  const { data: problemsData } = useQuery({
    queryKey: ['problems-for-ideas'],
    queryFn: () => problemsAPI.getProblems({ limit: 100 }),
    staleTime: 10 * 60 * 1000,
  });
  
  const problems = problemsData?.data?.problems || [];
  
  const { register, handleSubmit, reset, control, watch, formState: { errors, isSubmitting } } = useForm<IdeaFormData>({
    defaultValues: {
      teammates: [{ name: "", email: "", role: "", image: null }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "teammates"
  });

  const onSubmit = async (data: IdeaFormData) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit an idea.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const ideaData = {
        title: data.title,
        description: data.description,
        problemId: data.problemId,
        stage: data.stage,
        mentor: data.mentor,
        contact: data.contact,
        team: data.teammates.filter(teammate => teammate.name && teammate.email && teammate.role),
      };
      
      await ideasAPI.createIdea(ideaData);
      
      // Invalidate and refetch ideas
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
      
      toast({
        title: "Idea submitted successfully!",
        description: "Your idea has been published and is now visible to the community.",
      });
      
      reset();
      setTeamImagePreviews({});
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.response?.data?.message || "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const onSubmitOld = async (data: IdeaFormData) => {
    try {
      // Simulate form submission for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Idea submitted successfully!",
        description: "Your idea has been submitted for review.",
      });
      
      reset();
      setTeamImagePreviews({});
      setOpen(false);
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleTeamImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTeamImagePreviews(prev => ({
          ...prev,
          [index]: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeTeamImage = (index: number) => {
    setTeamImagePreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[index];
      return newPreviews;
    });
  };

  const addTeammate = () => {
    append({ name: "", email: "", role: "", image: null });
  };

  const removeTeammate = (index: number) => {
    remove(index);
    removeTeamImage(index);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0">
          <Plus className="w-4 h-4 mr-2" />
          Submit Idea
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-600">Submit a New Idea</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Idea Title *</Label>
              <Input 
                id="title"
                {...register("title", { required: "Title is required" })}
                placeholder="Enter your idea title"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <Label htmlFor="problemId">Related Problem *</Label>
              <Select onValueChange={(value) => register("problemId").onChange({ target: { value } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a problem" />
                </SelectTrigger>
                <SelectContent>
                  {problems.map((problem: any) => (
                    <SelectItem key={problem._id} value={problem._id}>
                      {problem.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.problemId && <p className="text-red-500 text-sm mt-1">Please select a problem</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Idea Description *</Label>
            <Textarea 
              id="description"
              {...register("description", { required: "Description is required" })}
              placeholder="Describe your solution in detail"
              rows={4}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stage">Development Stage</Label>
              <Select onValueChange={(value) => register("stage").onChange({ target: { value: parseInt(value) } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {stageLabels.map((stage, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {index + 1}. {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="mentor">Mentor (Optional)</Label>
              <Input 
                id="mentor"
                {...register("mentor")}
                placeholder="e.g., Prof. John Smith - Computer Science"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="contact">Contact Email *</Label>
            <Input 
              id="contact"
              type="email"
              {...register("contact", { 
                required: "Contact email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              placeholder="your.email@student.edu"
            />
            {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-lg font-semibold">Team Members</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addTeammate}
                className="text-green-600 border-green-600 hover:bg-green-50"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </div>
            
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border border-gray-200 rounded-lg mb-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Team Member {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeTeammate(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <div>
                    <Label>Name *</Label>
                    <Input 
                      {...register(`teammates.${index}.name`, { required: "Name is required" })}
                      placeholder="Full name"
                    />
                  </div>
                  
                  <div>
                    <Label>Email *</Label>
                    <Input 
                      type="email"
                      {...register(`teammates.${index}.email`, { 
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email"
                        }
                      })}
                      placeholder="email@student.edu"
                    />
                  </div>
                  
                  <div>
                    <Label>Role *</Label>
                    <Input 
                      {...register(`teammates.${index}.role`, { required: "Role is required" })}
                      placeholder="e.g., Developer, Designer"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Profile Image</Label>
                  <div className="mt-2">
                    {teamImagePreviews[index] ? (
                      <div className="relative inline-block">
                        <img 
                          src={teamImagePreviews[index]} 
                          alt="Preview" 
                          className="w-16 h-16 object-cover rounded-full border"
                        />
                        <button
                          type="button"
                          onClick={() => removeTeamImage(index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-16 h-16 border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:bg-gray-100">
                        <Upload className="w-4 h-4 text-gray-400" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleTeamImageUpload(index, e)}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0"
            >
              {isSubmitting ? "Submitting..." : "Submit Idea"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default IdeaSubmissionForm;