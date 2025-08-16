import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProblemFormData {
  title: string;
  excerpt: string;
  description: string;
  background: string;
  scalability: string;
  marketSize: string;
  competitors: string;
  currentGaps: string;
  tags: string;
  authorName: string;
  image: File | null;
}

const ProblemSubmissionForm = () => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProblemFormData>();

  const onSubmit = async (data: ProblemFormData) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit a problem.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const problemData = {
        user_id: user.id,
        title: data.title,
        excerpt: data.excerpt,
        description: data.description,
        background: data.background || null,
        scalability: data.scalability || null,
        market_size: data.marketSize || null,
        competitors: data.competitors ? data.competitors.split(',').map(c => c.trim()) : [],
        current_gaps: data.currentGaps || null,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
      };
      
      const { error } = await supabase
        .from('problems')
        .insert([problemData]);
      
      if (error) throw error;
      
      // Invalidate and refetch problems
      queryClient.invalidateQueries({ queryKey: ['problems'] });
      
      toast({
        title: "Problem submitted successfully!",
        description: "Your problem has been published and is now visible to the community.",
      });
      
      reset();
      setSelectedImage(null);
      setImagePreview(null);
      setOpen(false);
    } catch (error: any) {
      console.error('Problem submission error:', error);
      toast({
        title: "Submission failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const onSubmitOld = async (data: ProblemFormData) => {
    try {
      // Simulate form submission for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Problem submission data (demo):", {
        ...data,
        image: selectedImage,
        tags: data.tags.split(",").map(tag => tag.trim())
      });
      
      toast({
        title: "Problem submitted successfully!",
        description: "Your problem has been submitted for review.",
      });
      
      reset();
      setSelectedImage(null);
      setImagePreview(null);
      setOpen(false);
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0">
          <Plus className="w-4 h-4 mr-2" />
          Submit Problem
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-orange-600">Submit a New Problem</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Problem Title *</Label>
              <Input 
                id="title"
                {...register("title", { 
                  required: "Title is required",
                  minLength: { value: 5, message: "Title must be at least 5 characters" },
                  maxLength: { value: 200, message: "Title must not exceed 200 characters" }
                })}
                placeholder="Enter problem title"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input 
                id="tags"
                {...register("tags")}
                placeholder="e.g., Sustainability, Technology, Healthcare"
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
            </div>
          </div>

          <div>
            <Label htmlFor="excerpt">Brief Summary *</Label>
            <Textarea 
              id="excerpt"
              {...register("excerpt", { 
                required: "Summary is required",
                minLength: { value: 10, message: "Summary must be at least 10 characters" },
                maxLength: { value: 300, message: "Summary must not exceed 300 characters" }
              })}
              placeholder="Brief description of the problem (2-3 sentences)"
              rows={2}
            />
            {errors.excerpt && <p className="text-red-500 text-sm mt-1">{errors.excerpt.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">Detailed Description *</Label>
            <Textarea 
              id="description"
              {...register("description", { 
                required: "Description is required",
                minLength: { value: 50, message: "Description must be at least 50 characters" },
                maxLength: { value: 5000, message: "Description must not exceed 5000 characters" }
              })}
              placeholder="Provide a detailed explanation of the problem"
              rows={4}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <Label htmlFor="background">Problem Background</Label>
            <Textarea 
              id="background"
              {...register("background")}
              placeholder="Context and statistics about the problem"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="scalability">Scalability</Label>
              <Textarea 
                id="scalability"
                {...register("scalability")}
                placeholder="How widespread is this problem?"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="marketSize">Market Size</Label>
              <Input 
                id="marketSize"
                {...register("marketSize")}
                placeholder="e.g., $2.3B annual market"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="competitors">Existing Solutions/Competitors</Label>
            <Input 
              id="competitors"
              {...register("competitors")}
              placeholder="List existing solutions (comma-separated)"
            />
          </div>

          <div>
            <Label htmlFor="currentGaps">Current Gaps</Label>
            <Textarea 
              id="currentGaps"
              {...register("currentGaps")}
              placeholder="What's missing in current solutions?"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="image">Problem Image</Label>
            <div className="mt-2">
              {imagePreview ? (
                <div className="relative inline-block">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-500">Upload Image</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
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
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0"
            >
              {isSubmitting ? "Submitting..." : "Submit Problem"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProblemSubmissionForm;