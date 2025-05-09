
import { LockOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import FileUpload from "./FileUpload";

const AdminActions = ({ isAuthenticated, onLogout, onFileUpload }) => {
  const handleLogout = () => {
    onLogout();
    toast({
      title: "Logged out",
      description: "You have been logged out",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <FileUpload 
        onFileUpload={onFileUpload} 
        isAuthenticated={isAuthenticated} 
      />
      
      <Button 
        variant="ghost"
        className="gap-2"
        size="lg"
        onClick={handleLogout}
        type="button"
      >
        <LockOpen size={20} />
        Logout
      </Button>
    </div>
  );
};

export default AdminActions;
