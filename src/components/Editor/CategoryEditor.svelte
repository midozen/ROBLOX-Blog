<script lang="ts">
  import type { Category } from "@prisma/client";

  interface EditableCategory extends Category {
    unsaved?: boolean;
  }

  let requesting = false;
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
    requesting = true;
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
      requesting = false;
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

<button on:click={addUnsavedCategory}>New Category</button><br>

<ul>
  {#each editableCategories as category, index}
    <li>
      <input
        type="text"
        style={category.unsaved ? "font-style: italic; color: green;" : ""}
        bind:value={category.categoryName}
        disabled={requesting}
      />

      {#if category.unsaved}
        <button on:click={() => handleCategoryAction("create", category)} disabled={requesting}>Create</button>
        <button style="color: red;" on:click={() => discardUnsavedCategory(index)} disabled={requesting}>X</button>
      {:else}
        <button 
            on:click={() => handleCategoryAction("update", category)}
            disabled={requesting}
        >Update</button>
        <button
          style="color: red;"
          on:click={() =>
            confirm("Are you sure?") &&
            handleCategoryAction("delete", category)}
          disabled={requesting}>
            X
        </button>
      {/if}
    </li>
  {/each}

  {#if requesting}
    <p>Making request, please wait...</p>
  {/if}
</ul>
