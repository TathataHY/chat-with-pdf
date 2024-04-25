<script>
  import { Spinner, Button } from "flowbite-svelte";
</script>

<div class="flex items-center justify-center">
  <Button outline color="dark">
    <Spinner class="me-3" size="4" />
    Procesando archivo y extrayendo contenido...
  </Button>
</div>
