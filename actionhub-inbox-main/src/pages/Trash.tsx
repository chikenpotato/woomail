import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { useEmailStore } from '@/hooks/useEmailStore';
import EmailCard from '@/components/dashboard/EmailCard';
import { Trash2, RotateCcw, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Trash = () => {
  const navigate = useNavigate();
  const { trashedEmails, restoreEmail, permanentlyDeleteEmail, emptyTrash } = useEmailStore();

  const handleRestore = (id: string) => {
    restoreEmail(id);
    toast({
      title: "Email Restored",
      description: "The email has been moved back to your inbox.",
    });
  };

  const handlePermanentDelete = (id: string) => {
    permanentlyDeleteEmail(id);
    toast({
      title: "Email Deleted",
      description: "The email has been permanently deleted.",
    });
  };

  const handleEmptyTrash = () => {
    emptyTrash();
    toast({
      title: "Trash Emptied",
      description: "All emails in trash have been permanently deleted.",
    });
  };

  return (
    <div className="min-h-screen">
      <Header 
        title="Trash" 
        subtitle={`${trashedEmails.length} deleted emails`}
      />

      <div className="p-6">
        {trashedEmails.length > 0 && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              Items in trash will be permanently deleted after 30 days
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Empty Trash
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Empty Trash?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all {trashedEmails.length} emails in trash. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleEmptyTrash} className="bg-destructive text-destructive-foreground">
                    Delete All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {trashedEmails.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Trash2 className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">Trash is Empty</h2>
            <p className="text-muted-foreground mb-6">Deleted emails will appear here</p>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Back to Inbox
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {trashedEmails.map((email, index) => (
              <div 
                key={email.id}
                className="animate-slide-up opacity-0"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="glass-card p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{email.sender}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{email.subject}</p>
                      <p className="text-xs text-muted-foreground mt-1">{email.preview}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRestore(email.id)}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Restore
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Permanently?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This email will be permanently deleted. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handlePermanentDelete(email.id)} 
                              className="bg-destructive text-destructive-foreground"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Trash;