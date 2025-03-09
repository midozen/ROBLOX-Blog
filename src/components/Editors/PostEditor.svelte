<script lang="ts">
  import { formatDate, getPostLink } from "@utils/general";
  import { marked } from "marked";

  // All the external variables so we can make this multi-purpose
  export let postId: number | null = null;
  export let title: string = "New Blog Post";
  export let content: string = "";
  export let username: string; // Just for preview purposes
  export let categories: Array<{ id: number; categoryName: string }>;
  export let existingCategories: Array<{ id: number; categoryName: string }>; // Dude I don't even know anymore

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

    <!-- {#if !postId} -->
      <fieldset>
        <legend>Categories:</legend>
        {#each categories as { id, categoryName }}
          <label>
            <input
              type="checkbox"
              id={`category${id}`}
              name={`category${id}`}
              value={id}
              checked={existingCategories?.some(function(o) {return o["id"] === id}) ?? false}
            />
            {categoryName}
          </label><br />
        {/each}
      </fieldset>
    <!-- {/if} -->
    <br />
  {/if}

  <!-- Display Preview -->
  {#if isPreviewMode}
    <article class={`post type-post status-publish format-standard hentry`}>
      <header class="entry-header">
        <h1 class="entry-title">
          <a 
            href="#"
            title={title}
            rel="bookmark"
            >
            {title}
          </a>
        </h1>
        <div class="entry-meta">
          <span class="by-author">
            <span class="sep"> By </span> 
            <span class="author vcard">
              <a class="url fn n" href={`/author/${username}/`} title={`View all posts by ${username}`} rel="author">{username}</a>
            </span>
          </span> - 
          <time class="entry-date" datetime={new Date().toISOString()}>{formatDate(new Date())}</time>
        </div>
      </header>
      <div class="entry-content">
        {@html marked(content)}
      </div>
    
      <footer class="entry-meta">
          This entry was posted in
          <!-- <Fragment
            set:html={post.categories
              .map((category: any) => {
                return `<a href="/category/${category.categoryName}" title="View all posts in ${category.categoryName}" rel="category tag">${category.categoryName}</a>`;
              })
              .join(", ") || "<i>No Categories</i>"}
          /> -->
          by
          <a href={`/author/${username}/`}>{username}</a>
          . Bookmark the
          <a href="#"
            title={title}
            rel="bookmark"
            >permalink</a>.
    
          <div id="author-info">
            <div id="author-avatar">
              <img alt="" src={`${import.meta.env.PUBLIC_CDN_URL}/images/pfp/default.png`} class="avatar avatar-68 photo" width="68" height="68">
            </div>
            <div id="author-description">
              <h2>About {username}</h2>
              {"Blog Poster"}
              <div id="author-link">
                <a href={`/author/${username}/`} rel="author">
                  View all posts by {username} <span class="meta-nav">→</span></a>
              </div>
            </div>
          </div>
      </footer>
    </article>
    
    <div id="comments">
      <p class="nocomments"></p>
    </div>
  {/if}

  {#if !isPreviewMode}
    <button type="submit">
      {postId ? 'Update' : 'Create'} Post
    </button>
  {/if}
</form>
