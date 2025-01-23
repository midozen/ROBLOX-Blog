<script lang="ts">
  import type { Category } from "@utils/types";

  interface EditableCategory extends Category {
    unsaved?: boolean;
  }

  export let categories: Array<Category>;

  let editableCategories: Array<EditableCategory> = categories.map(
    (category) => ({
      ...category,
      unsaved: false,
    })
  );

  async function handleCategoryAction(
    action: "create" | "update" | "delete",
    category: EditableCategory
  ) {
    try {
      let endpoint = "";
      let method = "POST";
      let body = null;

      switch (action) {
        case "create":
          endpoint = "/api/category/create";
          body = JSON.stringify(category);
          break;
        case "update":
          endpoint = "/api/category/update";
          body = JSON.stringify(category);
          break;
        case "delete":
          endpoint = `/api/category/delete?id=${category.id}`;
          break;
      }

      const res = await fetch(endpoint, { method, ...(body && { body }) });

      if (!res.ok) throw new Error(await res.text());
      location.reload();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";

      alert(`Error attempting action ${action.toUpperCase()}: ${errorMessage}`);
    }
  }

  function addUnsavedCategory() {
    editableCategories = [
      ...editableCategories,
      {
        id: 0,
        categoryName: "New Category",
        unsaved: true,
      },
    ];
  }

  function discardUnsavedCategory(index: number) {
    if (!editableCategories[index].unsaved) {
      alert("Cannot discard a saved category.");
      return;
    }

    editableCategories = editableCategories.filter((_, i) => i !== index);
  }
</script>

<ul>
  <button on:click={addUnsavedCategory}>New Category</button>

  {#each editableCategories as category, index}
    <li>
      <input
        type="text"
        bind:value={category.categoryName}
        style={category.unsaved ? "font-style: italic; color: green;" : ""}
      />

      {#if category.unsaved}
        <button on:click={() => handleCategoryAction("create", category)}>Create</button>
        <button style="color: red;" on:click={() => discardUnsavedCategory(index)}>X</button>
      {:else}
        <button on:click={() => handleCategoryAction("update", category)}>Update</button>
        <button
          style="color: red;"
          on:click={() =>
            confirm("Are you sure?") &&
            handleCategoryAction("delete", category)}
        >
            X
        </button>
      {/if}
    </li>
  {/each}
</ul>
