<script>
  import { onMount } from "svelte";
  import { stores } from "@sapper/app";
  import { create } from "../api/create-profile.js";
  import { profile as profileStore } from "../routes/_profile.js";
  let profile = {};
  $: if ($profileStore.profile) {
    profile = $profileStore.profile;
  }
</script>

<style>
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
  .center {
    text-align: center;
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
</style>

<!-- markup (zero or more items) goes here -->
{#if profile.status !== 200 && !$profileStore.loading}
  <div class="TwoUp" data-status={profile.status}>
    <div class="Card">
      <h2 id="modal-1-title" class="Modal-title">
        Do you want to create a Rebus Ink account?
      </h2>
      <div id="modal-1-content" class="Modal-content">
        <p class="Modal-text">
          You will need to provide your email address in order to create a new
          account. No other data will be collected and your email will not be
          shared with any third parties. We may use your email address to
          contact you for technical-support reasons, but not for promotional
          purposes. (If you would like to receive our newsletter, however,
          subscribe on the
          <a href="https://rebus.ink/contact/">Rebus Ink contact page.</a>
          )
        </p>
        <div class="center">
          <p>
            <a href="https://google.com/">No thanks</a>
          </p>

          <p>
            <button
              class="Button"
              on:click={async event => {
                event.target.disabled = 'true';
                event.target.setAttribute('working', 'true');
                const newProfile = await create($profileStore);
                profileStore.set({
                  profile: newProfile.profile,
                  user: newProfile.user,
                  loading: false
                });
                profile = newProfile.profile;
              }}>
              Yes, create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
{/if}
