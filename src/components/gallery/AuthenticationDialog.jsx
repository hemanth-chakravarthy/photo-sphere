
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// This would typically be stored securely on a backend
// For demo purposes we're using a hardcoded password
const ADMIN_PASSWORD = "photosphere123";

const AuthenticationDialog = ({ isOpen, onClose, onAuthenticate }) => {
  const [password, setPassword] = useState("");

  const handleAuthentication = () => {
    if (password === ADMIN_PASSWORD) {
      onAuthenticate();
      onClose();
      localStorage.setItem("isPhotoSphereAdmin", "true");
      toast({
        title: "Authentication successful",
        description: "You can now upload images",
      });
    } else {
      toast({
        title: "Authentication failed",
        description: "Incorrect password",
        variant: "destructive"
      });
    }
    setPassword("");
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Authentication Required</DialogTitle>
          <DialogDescription>
            Enter your password to access admin functions.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAuthentication();
                }
              }}
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              onClick={handleAuthentication}
            >
              Login
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthenticationDialog;
