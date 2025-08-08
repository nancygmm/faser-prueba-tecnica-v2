import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Task } from './models/task.model';

type RemoteTodo = { userId: number; id: number; title: string; completed: boolean };

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Control de Tareas - Nancy Mazariegos';
  tasks: Task[] = [];
  showDialog = false;
  editingTask: Task | null = null;
  formTitle = '';
  formDuration: number | null = null;

  showBulkDialog = false;
  bulkText = '';

  constructor(private http: HttpClient) {}

  addTask() { 
    this.editingTask = null;
    this.formTitle = '';
    this.formDuration = null;
    document.body.style.overflow = 'hidden';
    this.showDialog = true;
  }

  openEditDialog(task: Task) { // Abre el modal donde podemos editar o eliminar
    this.editingTask = { ...task };
    this.formTitle = task.title;
    this.formDuration = task.duration;
    document.body.style.overflow = 'hidden';
    this.showDialog = true;
  }

  saveFromDialog() { // Guarda cambios realizados
    const duration = Number(this.formDuration ?? 0);
    const title = (this.formTitle ?? '').trim();
    if (this.editingTask) {
      const idx = this.tasks.findIndex(t => t.id === this.editingTask!.id);
      if (idx >= 0) this.tasks[idx] = { ...this.editingTask, title, duration };
    } else {
      const newTask: Task = { id: Date.now(), title, duration };
      this.tasks.push(newTask);
    }
    this.closeDialog();
  }

  deleteFromDialog() { // Elimina la tarea
    if (!this.editingTask) return;
    this.tasks = this.tasks.filter(t => t.id !== this.editingTask!.id);
    this.closeDialog();
  }

  closeDialog() { // Cierra Modal
    this.showDialog = false;
    this.editingTask = null;
    this.formTitle = '';
    this.formDuration = null;
    document.body.style.overflow = '';
  }

  openBulkDialog() { // Este es el pop up para realizar la carga masiva
    this.bulkText = '';
    document.body.style.overflow = 'hidden';
    this.showBulkDialog = true;
  }

  closeBulkDialog() { // Cierra la carga masiva
    this.showBulkDialog = false;
    this.bulkText = '';
    document.body.style.overflow = '';
  }

  processBulk() { // Procesa la estructura de texto de la carga masiva
    const lines = (this.bulkText || '')
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(l => l.length > 0);

    const ts = Date.now();
    const parsed: Task[] = [];

    lines.forEach((line, i) => {
      const match = line.match(/\|\s*(\d+)\s*$/);
      const duration = match ? parseInt(match[1], 10) : 10;
      const title = match ? line.slice(0, match.index).trim() : line;
      if (title) parsed.push({ id: ts + i, title, duration }); // Indica que es lo que va a agregar: id y titulo de la tarea
    });

    if (parsed.length) this.tasks = [...this.tasks, ...parsed];
    this.closeBulkDialog();
  }

  fetchFromServer() { // Conexión con el API Rest
    this.http.get<RemoteTodo[]>('https://jsonplaceholder.typicode.com/todos')
      .subscribe(data => {
        const arr = [...data];
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        const pick = arr.slice(0, 5); // Acá es donde le indicamos que debe de agarrar 5 tareas
        const base = Date.now();
        const mapped: Task[] = pick.map((t, i) => ({
          id: base + i,
          title: t.title, // El titulo de la tarea
          duration: t.userId // Indicamos que el Id será utilizado como la duracion (min)
        }));
        this.tasks = [...this.tasks, ...mapped];
      });
  }
}
