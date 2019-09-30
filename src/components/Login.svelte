<script>
  import { profile } from "../routes/_profile.js";
  import { getToken } from "../api/get-cookie.js";
  import { onMount } from "svelte";
  onMount(async () => {
    const response = await fetch("/api/whoami", {
      credentials: "include"
    });
    const profileData = await response.json();
    profile.set(profileData);
  });
</script>

<style>
  /* your styles go here */
  .LoginModal {
    position: fixed;
    z-index: 100;
    background-color: white;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .TwoUp {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 100vh;
    background-image: url(https://rebus.ink/wp-content/themes/nudge-rebus/assets/green/header_bg.svg);
    background-size: 100%;
    background-repeat: no-repeat;
    padding: 5vh 5vw;
  }

  @media (max-width: 840px) {
    .TwoUp {
      flex-direction: column;
    }
  }
  .Card {
    background-color: #fff;
    max-width: 500px;
    max-height: 100vh;
    min-width: 300px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    box-sizing: border-box;
    position: relative;
    display: flex;
    flex-direction: column;
    box-shadow: 1px 1px 14px -2px rgba(0, 0, 0, 0.15);
    padding: 1rem;
  }
  .Card h2 {
    line-height: 1.2;
  }

  .Card--flat {
    box-shadow: none;
    background-color: rgba(255, 255, 255, 0.85);
  }
</style>

{#if $profile && !$profile.user && !$profile.loading}
  <!-- markup (zero or more items) goes here -->
  <div class="LoginModal">

    <div class="TwoUp">
      <div class="Card">
        <h2 id="modal-1-title" class="Modal-title">
          First time using Rebus Ink?
        </h2>
        <div id="modal-1-content" class="Modal-content">
          <p class="Modal-text">Create an account to use the platform.</p>
          <div class="Modal-row">
            <span />
            <form
              action="/login?returnTo=%2Flibrary"
              method="POST"
              id="sign-up-form">
              <!-- <input type="hidden" name="_csrf" value={getToken()} /> -->
              <button
                class="Button"
                on:click={() => document
                    .getElementById('sign-up-form')
                    .submit()}
                name="Sign Up">
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>

      <div class="Card Card--flat">
        <h2 id="modal-1-title" class="Modal-title">Returning to Rebus Ink?</h2>
        <div id="modal-1-content" class="Modal-content">
          <p class="Modal-text">Sign in to use the platform.</p>
          <div class="Modal-row">
            <span />
            <form action="/login" method="POST" id="sign-in-form">
              <!-- <input type="hidden" name="_csrf" value={getToken()} /> -->
              <button
                class="Button"
                on:click={() => document
                    .getElementById('sign-in-form')
                    .submit()}
                name="Sign In">
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
