import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Trash2, X, Info, AlertTriangle, ShoppingBag, Star, Tag } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const ICON_MAP: Record<string, any> = {
  info: Info, warning: AlertTriangle, order: ShoppingBag, review: Star, offer: Tag, low_stock: AlertTriangle,
};

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllRead, clearAll } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button whileTap={{ scale: 0.9 }} onClick={() => setOpen(!open)} className="relative w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
        <Bell className="w-4 h-4 text-foreground" />
        {unreadCount > 0 && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-12 w-80 max-h-96 rounded-2xl bg-card border border-border shadow-elevated z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <p className="text-sm font-bold text-foreground">Notifications</p>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-[10px] text-primary font-semibold px-2 py-1 rounded-lg hover:bg-primary/10">Read all</button>
                  )}
                  {notifications.length > 0 && (
                    <button onClick={clearAll} className="p-1 rounded-lg hover:bg-destructive/10"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
                  )}
                  <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-muted"><X className="w-3.5 h-3.5 text-muted-foreground" /></button>
                </div>
              </div>
              <div className="overflow-y-auto max-h-72">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center">
                    <Bell className="w-8 h-8 mx-auto text-muted-foreground/20 mb-2" />
                    <p className="text-sm text-muted-foreground">No notifications</p>
                  </div>
                ) : notifications.map(n => {
                  const Icon = ICON_MAP[n.type] || Info;
                  return (
                    <button key={n.id} onClick={() => markAsRead(n.id)}
                      className={`w-full text-left px-4 py-3 flex items-start gap-3 border-b border-border/50 hover:bg-muted/50 transition-colors ${!n.is_read ? 'bg-primary/5' : ''}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${!n.is_read ? 'bg-primary/10' : 'bg-muted'}`}>
                        <Icon className={`w-4 h-4 ${!n.is_read ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold ${!n.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>{n.title}</p>
                        {n.message && <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>}
                        <p className="text-[10px] text-muted-foreground/60 mt-1">{dayjs(n.created_at).fromNow()}</p>
                      </div>
                      {!n.is_read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
