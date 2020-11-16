<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">To Do List Tugas PAW</h3>

    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>

        <v-spacer></v-spacer>

        <v-btn color="success" dark @click="dialog = true"> tambah </v-btn>
      </v-card-title>

      <v-data-table :headers="headers" :items="todos" :search="search">
        <template v-slot:[`item.priority`]="{ item }">
          <td>
            <v-card
              v-if="item.priority == 'Penting'"
              style="
                border-color: lightcoral;
                color: lightcoral;
                width: fit-content;
              "
              outlined
            >
              {{ item.priority }}
            </v-card>
            <v-card
              v-else-if="item.priority == 'Biasa'"
              style="
                border-color: lightblue;
                color: lightblue;
                width: fit-content;
              "
              outlined
            >
              {{ item.priority }}
            </v-card>
            <v-card
              v-else
              outlined
              style="
                border-color: lightgreen;
                color: lightgreen;
                width: fit-content;
              "
            >
              {{ item.priority }}
            </v-card>
          </td>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="icnote mr-2" @click="detailItem(item)">{{
            icons.mdiTextBoxSearchOutline
          }}</v-icon>
          <v-icon small class="pencil mr-2" @click="editItem(item)">
            {{ icons.mdiPencil }}</v-icon
          >
          <v-icon small class="bin mr-2" @click="deleteItem(item)">
            {{ icons.mdiDelete }}</v-icon
          >
        </template>
        <template v-slot:[`item.checkbox`]="{ item }">
                    <v-checkbox v-model="item.isSelected"></v-checkbox>
        </template>
      </v-data-table>
    </v-card>

    <v-card
            v-if="todos.filter((todo) => todo.isSelected).length > 0"
            class="mt-5"
        >
            <v-card-title>
                <span class="font-weight-bold">Delete Multiple</span>
            </v-card-title>
            <v-card-text>
                <span class="font-weight-bold ml-1">Todo terpilih:</span>
                <ul
                    v-for="(todo, index) in todos.filter(
                        (todo) => todo.isSelected
                    )"
                    :key="index"
                >
                    <li>{{ todo.task }}</li>
                </ul>
                <v-btn
                    class="mt-6"
                    color="red"
                    dark
                    @click="dialogMultiple = true"
                >
                    Hapus Semua
                </v-btn>
            </v-card-text>
        </v-card>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline" v-if="adding == true"> Form Todo - Add </span>
          <span class="headline" v-else> Form Todo - Edit </span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-text-field
              v-model="formTodo.task"
              label="Task"
              required
              autofocus
            ></v-text-field>

            <v-select
              v-model="formTodo.priority"
              :items="['Penting', 'Biasa', 'Tidak penting']"
              label="Priority"
              required
            ></v-select>

            <v-textarea
              v-model="formTodo.note"
              label="Note"
              required
            ></v-textarea>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>

          <v-btn v-if="adding == true" color="blue darken-1" text @click="save">
            Save
          </v-btn>

          <v-btn v-else color="blue darken-1" text @click="edit(formTodo)">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogdel" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline"> Yakin ingin menghapus? </span>
        </v-card-title>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="cancel"> Tidak </v-btn>

          <v-btn color="red darken-1" text @click="confirmdelete"> Ya </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogMultiple" persistent max-width="450px">
            <v-card>
                <v-card-title>
                    <span class="headline font-weight-bold"
                        >Menghapus 
                        {{ todos.filter((todo) => todo.isSelected).length }}
                        todo?</span
                    >
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="green darken-1"
                        text
                        @click="dialogMultiple = false"
                    >
                        Tidak
                    </v-btn>
                    <v-btn
                        color="red darken-1"
                        text
                        @click="confirmDeleteMultiple"
                    >
                        Ya
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    <v-dialog v-model="dialognote" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">
            {{ detail.task }}
          </span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-card
              v-if="detail.priority == 'Penting'"
              style="
                border-color: lightcoral;
                color: lightcoral;
                width: fit-content;
              "
              outlined
            >
              {{ detail.priority }}
            </v-card>
            <v-card
              v-else-if="detail.priority == 'Biasa'"
              style="
                border-color: lightblue;
                color: lightblue;
                width: fit-content;
              "
              outlined
            >
              {{ detail.priority }}
            </v-card>
            <v-card
              v-else
              outlined
              style="
                border-color: lightgreen;
                color: lightgreen;
                width: fit-content;
              "
            >
              {{ detail.priority }}
            </v-card>
            {{ detail.note }}
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="cancel"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-main>
</template>
<script>
import { mdiPencil, mdiDelete, mdiTextBoxSearchOutline } from "@mdi/js";

export default {
  name: "List",

  data() {
    return {
      search: null,
      adding: true,
      edititem: null,
      dialog: false,
      dialogdel: false,
      dialogMultiple: false,
      dialognote: false,

      icons: {
        mdiPencil,
        mdiDelete,
        mdiTextBoxSearchOutline,
      },

      filters: {
        search: "",
        priority: "",
      },
      headersFinished: [
                {
                    text: "Task",
                    align: "start",
                    sortable: true,
                    value: "task",
                },
                { text: "Priority", value: "priority" },
                { text: "Note", value: "note" },
        ],

      headers: [
        {
          text: "Task",
          align: "start",
          sortable: true,
          value: "task",
        },

        {
          text: "Priority",
          field: "priority",
          value: "priority",
        },
        {
          text: "Actions",
          value: "actions",
          sortable: false,
        },
        { text: "", 
        value: "checkbox",
        },
      ],

      todos: [
        {
          task: "bernafas",
          priority: "Penting",
          note: "huffttt",
          isSelected: false,
        },
        {
          task: "nongkrong",
          priority: "Tidak penting",
          note: "bersama tman2",
          isSelected: false,
        },
        {
          task: "masak",
          priority: "Biasa",
          note: "masak air 500ml",
          isSelected: false,
        },
      ],

      formTodo: {
        task: null,
        priority: null,
        note: null,
        isSelected: false,
      },

      detail: {
        task: null,
        priority: null,
        note: null,
        isSelected: null,
      },
    };
  },

  methods: {
    save() {
      this.todos.push(this.formTodo);
      this.cancel();
    },

    cancel() {
      this.resetForm();
      this.dialog = false;
      this.edititem = null;
      this.adding = true;
      this.dialogdel = false;
      this.dialognote = false;
    },

    deleteItem(item) {
      this.dialogdel = true;
      this.edititem = item;
    },

    confirmdelete() {
      this.todos.splice(this.todos.indexOf(this.edititem), 1);
      this.dialogdel = false;
    },

    cancelDelete() {
            this.dialogDelete = false;
            this.editIndex = -1;
    },

    getColor(prioritas) {
            if (prioritas === "Penting") return "red";
            else if (prioritas === "Biasa") return "blue";
            else return "green";
    },

    confirmDeleteMultiple() {
            this.todos = this.todos.filter((todo) => !todo.isSelected);
            this.dialogMultiple = false;
    },

    editItem(item) {
      this.adding = false;
      this.formTodo = {
        task: item.task,
        priority: item.priority,
        note: item.note,
      };
      this.dialog = true;
      this.edititem = item;
    },

    detailItem(item) {
      this.detail = {
        task: item.task,
        priority: item.priority,
        note: item.note,
      };
      this.dialognote = true;
    },

    edit(formTodo) {
      this.edititem.task = formTodo.task;
      this.edititem.priority = formTodo.priority;
      this.edititem.note = formTodo.note;
      this.edititem.isSelected = formTodo.isSelected;
      this.cancel();
    },

    resetForm() {
      this.formTodo = {
        task: null,
        priority: null,
        note: null,
        isSelected: null,
      };
    },
  },
};
</script>

<style scoped>
.icnote {
  color: plum !important;
}
.pencil {
  color: lightblue !important;
}
.bin {
  color: lightcoral !important;
}
</style>
