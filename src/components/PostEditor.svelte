<script lang="ts">
  import { formatDate } from "@utils/general";
  import { marked } from "marked";

  // All the external variables so we can make this multi-purpose
  export let postId: number | null = null;
  export let title: string = "New Blog Post";
  export let content: string = "";
  export let username: string; // Just for preview purposes
  export let categories: Array<{ id: number; categoryName: string }>;

  let isPreviewMode = false;
  $: formAction = `/api/post/${postId ? "edit" : "new"}`;
</script>

<form
  style="max-width: 502px; text-align: left;"
  method="POST"
  action={formAction}
>
  {#if postId}
    <input type="hidden" name="postID" value={postId} />
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
        bind:value={title}
        placeholder="Title"
        required
      />
      <br />

      <textarea
        bind:value={content}
        name="content"
        style="min-width: 468px; max-width: 468px; height: 500px;"
        placeholder="Write your post content here..."
        required
      ></textarea>
    </fieldset>

    {#if !postId}
      <fieldset>
        <legend>Categories:</legend>
        {#each categories as { id, categoryName }}
          <label>
            <input
              type="checkbox"
              id={`category${id}`}
              name={`category${id}`}
              value={id}
            />
            {categoryName}
          </label><br />
        {/each}
      </fieldset>
    {/if}
    <br />
  {/if}

  <!-- Display Preview -->
  {#if isPreviewMode}
    <span class="posted-by date">
      {formatDate(new Date())}
    </span>

    <h2 class="storytitle">
      <a href="#" rel="bookmark">
        {title}
      </a>
    </h2>

    <div class="storycontent">
      <div>{@html marked(content)}</div>
      <p>- {username}</p>

      <div>
        <a href="#" title="Bookmark using any bookmark manager!">
          <img
            src="/images/button1-bm.gif"
            alt="AddThis Social Bookmark Button"
            width="125"
            height="16"
          />
        </a>
      </div>
      <br />
    </div>
    <div class="post-footer">
      <div class="meta">
        Posted in:
        <i>No Categories</i>
      </div>
      <div class="feedback">
        <span>Comments Off</span>
      </div>
      <div class="clear"></div>
    </div>
  {/if}

  {#if !isPreviewMode}
    <button type="submit">
      {postId ? 'Update' : 'Create'} Post
    </button>
  {/if}
</form>
