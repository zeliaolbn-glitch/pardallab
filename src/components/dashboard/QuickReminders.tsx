import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Save, X } from 'lucide-react';
import { toast } from 'sonner';

/**
 * QuickReminders – A compact editable list of short reminder items.
 *
 * Features:
 *  - Add, edit, and delete individual reminders.
 *  - Persist reminders in `localStorage` under the key `dashboard_quick_reminders`.
 *  - Small‑font, glass‑like card that matches the existing dashboard aesthetic.
 */
export function QuickReminders() {
  const STORAGE_KEY = 'dashboard_quick_reminders';
  const [reminders, setReminders] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(true);

  // Load persisted reminders on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setReminders(JSON.parse(stored));
      } catch {
        // Fallback to raw string split (legacy format)
        setReminders(stored.split('\n'));
      }
    }
  }, []);

  // Persist on explicit save
  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
    setIsSaved(true);
    toast.success('Lembretes salvos!');
  };

  const addReminder = () => {
    setReminders(prev => [...prev, '']);
    setIsSaved(false);
  };

  const updateReminder = (index: number, value: string) => {
    const newRem = [...reminders];
    newRem[index] = value;
    setReminders(newRem);
    setIsSaved(false);
  };

  const deleteReminder = (index: number) => {
    const newRem = reminders.filter((_, i) => i !== index);
    setReminders(newRem);
    setIsSaved(false);
  };

  return (
    <Card className="border-none shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
      <CardHeader className="bg-slate-50 border-b py-2 px-4 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xs font-medium text-slate-700 flex items-center gap-2">
          <Plus className="h-3 w-3 text-blue-600" />
          Quadros de Lembrete Rápido
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className={`h-7 px-2 gap-1 ${isSaved ? 'text-slate-400' : 'text-blue-600 animate-pulse'}`}
          onClick={handleSave}
        >
          <Save className="h-3 w-3" />
          {isSaved ? 'Salvo' : 'Salvar'}
        </Button>
      </CardHeader>
      <CardContent className="p-2">
        <ul className="space-y-1 text-xs text-slate-800 dark:text-slate-200">
          {reminders.map((item, idx) => (
            <li key={idx} className="flex items-center gap-1">
              <input
                type="text"
                value={item}
                placeholder="Lembrete..."
                className="flex-1 bg-transparent border-b border-dashed border-slate-400 focus:outline-none focus:border-blue-500 text-xs"
                onChange={e => updateReminder(idx, e.target.value)}
              />
              <Button variant="ghost" size="sm" onClick={() => deleteReminder(idx)} aria-label="Remover lembrete">
                <X className="h-3 w-3 text-red-500" />
              </Button>
            </li>
          ))}
        </ul>
        <Button variant="outline" size="sm" className="mt-2 w-full" onClick={addReminder}>
          <Plus className="h-3 w-3 mr-1" />
          Adicionar lembrete
        </Button>
      </CardContent>
    </Card>
  );
}
