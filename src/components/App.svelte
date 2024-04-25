<script>
  import { StepUpload, StepLoading, StepChat } from "@/components";
  import { APP_STATUS, appStatus } from "@/store";
  import { Alert } from "flowbite-svelte";
</script>

{#if $appStatus === APP_STATUS.INIT}
  <StepUpload />
{:else if $appStatus === APP_STATUS.LOADING}
  <StepLoading />
{:else if $appStatus === APP_STATUS.CHAT_MODE}
  <StepChat />
{:else if $appStatus === APP_STATUS.ERROR}
  <div class="p-8">
    <Alert>
      <span class="font-medium">¡Algo mal ha pasado!</span>
      Por favor, inténtalo de nuevo.
    </Alert>
  </div>
{:else}
  <div class="p-8">
    <Alert>
      <span class="font-medium">Acción no reconocida</span>
      Por favor, inténtalo de nuevo.
    </Alert>
  </div>
{/if}
