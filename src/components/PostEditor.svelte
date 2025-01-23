<script lang="ts">
  import { formatDate } from "@utils/general";
  import { marked } from "marked";

  export let postId: number | null = null;

  export let content: string = "";
  export let title: string = "New Blog Post";

  export let username: string;
  export let categories: any[];

  let preview = false;

  console.log(postId);
</script>

<form
  style="max-width: 502px; text-align: left;"
  method="POST"
  action={`/api/post/${postId ? "edit" : "new"}`}
>
  {#if postId}
  <input type="hidden" name="postID" value={postId}>
  {/if}

  <input type="checkbox" bind:checked={preview} id="preview" />
  <label for="preview">Preview Post</label>
  <br />

  <div style={preview ? "display: none;" : ""}>
    <fieldset>
      <legend>Write Here:</legend>
    <input type="text" name="title" id="title" bind:value={title} placeholder="Title" />
    <br>
    
    <textarea
      bind:value={content}
      name="content"
      style="min-width: 468px; max-width: 468px; height: 500px;"
      placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing el..."
    ></textarea>
    </fieldset>

    {#if !postId}
      <fieldset>
        <legend>Categories:</legend>
        {#each categories as category, index}
          <input type="checkbox" id={`category${index + 1}`} name={`category${index + 1}`} value={category.id}>
          <label for={`category${index + 1}`}> {category.categoryName}</label><br>
        {/each}
      </fieldset>
    {/if}
    <br>
  </div>

  <div style={preview ? "" : "display: none;"} class="post">
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
  </div>

  <button type="submit" style={preview ? "display: none;" : ""}>Create</button>
</form>
