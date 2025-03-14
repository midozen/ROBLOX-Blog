<script lang="ts">
  import { marked } from "marked";

  import { formatDateWithOrdinal } from "@utils/date";
  import { globalMarkedExtensions } from "@utils/index";

  import PostPreview from "@components/Editor/Post/PostPreview.svelte";
  import InsertAttachment from "@components/Editor/Post/InsertAttachment.svelte";

  import type { Post } from "@utils/types/post";
  import type { User } from "@utils/types/user";

  export let user: User;
  export let categories: Array<{ id: number; categoryName: string }>;

  export let post: Post = {
    id: -1,
    title: "New Blog Post",
    slug: "",
    content: "",
    author: user,
    authorId: user.id,
    categories: [],
    dateCreated: new Date(),
  };

  let isPreviewMode = false;
  let selectedCategories = new Set(post.categories.map(c => c.id));

  function toggleCategory(categoryId: number) {
    if (selectedCategories.has(categoryId)) {
      selectedCategories.delete(categoryId);
    } else {
      selectedCategories.add(categoryId);
    }
    selectedCategories = selectedCategories; // Trigger reactivity
    post.categories = categories.filter(c => selectedCategories.has(c.id));
  }

  $: formAction = `/api/post/${(post.id !== -1) ? "edit" : "new"}`;

  marked.use(globalMarkedExtensions);
</script>

<form
  style="max-width: 502px; text-align: left;"
  method="POST"
  action={formAction}
>
  {#if post.id !== -1}
    <input type="hidden" name="postID" value={post.id} />
  {/if}

  <label>
    <input type="checkbox" bind:checked={isPreviewMode} id="preview" />
    Preview Post
  </label>

  <!-- Display Editor -->
  {#if !isPreviewMode}
    <fieldset>
      <legend>Write Here:</legend>

      <input
        type="text"
        name="title"
        id="title"
        bind:value={post.title}
        placeholder="Title"
        required
      />
      <br />

      <InsertAttachment bind:content={post.content} />

      <textarea
        bind:value={post.content}
        name="content"
        style="min-width: 468px; max-width: 468px; height: 500px;"
        placeholder="Write your post content here..."
        required
      ></textarea>
    </fieldset>

    <fieldset>
      <legend>Categories:</legend>
      {#each categories as { id, categoryName }}
        <label>
          <input
            type="checkbox"
            id={`category${id}`}
            name={`category${id}`}
            value={id}
            checked={selectedCategories.has(id)}
            on:change={() => toggleCategory(id)}
          />
          {categoryName}
        </label><br />
      {/each}
    </fieldset>
    <br />
  {/if}

  <!-- Display Preview -->
  {#if isPreviewMode}
    <PostPreview {post} />
  {/if}

  {#if !isPreviewMode}
    <button type="submit">
      {post.id ? 'Update' : 'Create'} Post
    </button>
  {/if}
</form>
