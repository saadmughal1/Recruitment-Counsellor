
import { Bell } from "lucide-react";

interface NotificationIndicatorProps {
  count: number;
}

export const NotificationIndicator = ({ count }: NotificationIndicatorProps) => {
  return (
    <div className="relative">
      <Bell className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </div>
  );
};
