<script>
  import Router from "svelte-spa-router";
  import ClassicKeyboard from "./Routes/ClassicKeyboard.svelte";
  import AdvancedKeyboard from "./Routes/AdvancedKeyboard.svelte";

  const routes = {
    "/": ClassicKeyboard,
    "/advanced": AdvancedKeyboard
  };
</script>

<Router {routes} />
