<script lang="ts">
  import { formatDate, getPostLink } from "@utils/general";
  import type { Post, User } from "@utils/types";
  import { marked } from "marked";

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
  $: formAction = `/api/post/${(post.id !== -1) ? "edit" : "new"}`;
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

      <textarea
        bind:value={post.content}
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
              checked={post.categories?.some(function(o) {return o["id"] === id}) ?? false}
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
            href={`#`}
            title={post.title}
            rel="bookmark"
            >
            {post.title}
          </a>
        </h1>
        <div class="entry-meta">
          <span class="by-author">
            <span class="sep"> By </span> 
            <span class="author vcard">
              <a class="url fn n" href={`#`} title={`View all posts by ${post.author.username}`} rel="author">{post.author.username}</a>
            </span>
          </span> - 
          <time class="entry-date" datetime={new Date().toISOString()}>{formatDate(new Date())}</time>
        </div>
      </header>
      <div class="entry-content">
        {@html marked(post.content!)}
      </div>
    
      <footer class="entry-meta">
          This entry was posted in
          <i>No Categories</i>
          by
          <a href={`#`}>{post.author.username}</a>
          . Bookmark the
          <a href={`#`}
            title={post.title}
            rel="bookmark"
            >permalink</a>.
    
          <div id="author-info">
            <div id="author-avatar">
              <img alt="" src={`${import.meta.env.PUBLIC_CDN_URL}/images/pfp/${user.pfp}`} class="avatar photo" width="68" height="68">
            </div>
            <div id="author-description">
              <h2>About {post.author.username}</h2>
              {post.author.bio}
              <div id="author-link">
                <a href={`#`} rel="author">
                  View all posts by {post.author.username} <span class="meta-nav">→</span></a>
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
      {post.id ? 'Update' : 'Create'} Post
    </button>
  {/if}
</form>
