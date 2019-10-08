<script>
  import Toolbar from "../components/Toolbar.svelte";
  import Login from "../components/Login.svelte";
  import Profile from "../components/Profile.svelte";
  import Loading from "../components/Loading.svelte";
  import Layout from "../layout/Layout.svelte";
  import { profile } from "../routes/_profile.js";
  export let segment;
</script>

<style>
  :global(body) {
    background-color: var(--main-background-color);
  }
</style>

<Login />
{#if $profile.profile && $profile.profile.status !== 200 && !$profile.loading}
  <Profile />
{:else if $profile.loading}
  <Loading />
{:else}
  <!-- To switch back to the old mechanism, replace <Layout> here with <main> -->
  <Layout>
    <slot />
  </Layout>
{/if}
