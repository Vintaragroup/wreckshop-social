import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ArrowRight, GitBranch, Mail, MessageSquare, Timer, Users, Zap } from "lucide-react";

type JourneyStep = {
  id: string;
  type: 'trigger' | 'delay' | 'condition' | 'email' | 'sms' | 'branch' | 'exit' | 'webhook';
  name?: string;
};

export type JourneyDoc = {
  _id: string;
  name: string;
  steps: JourneyStep[];
};

function stepIcon(type: JourneyStep['type']) {
  switch (type) {
    case 'trigger': return Users;
    case 'delay': return Timer;
    case 'email': return Mail;
    case 'sms': return MessageSquare;
    case 'condition':
    case 'branch': return GitBranch;
    case 'exit':
    case 'webhook':
    default: return Zap;
  }
}

interface ViewJourneyCanvasProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  journey: JourneyDoc | null;
}

export function ViewJourneyCanvas({ open, onOpenChange, journey }: ViewJourneyCanvasProps) {
  const steps = journey?.steps || [];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{journey?.name || 'Journey'}</DialogTitle>
        </DialogHeader>
        {steps.length === 0 ? (
          <div className="text-sm text-muted-foreground">No steps yet.</div>
        ) : (
          <div className="flex items-center flex-wrap gap-2 text-xs">
            {steps.map((s, idx) => {
              const Icon = stepIcon(s.type);
              return (
                <div className="flex items-center" key={s.id || idx}>
                  <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="ml-2 mr-3 text-muted-foreground truncate max-w-[150px]">{s.name || s.type}</span>
                  {idx < steps.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground mr-3" />}
                </div>
              )
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
