<script>
  import Router from "svelte-spa-router";
  import ClassicKeyboard from "./Routes/ClassicKeyboard.svelte";
  import Prototype from "./Routes/Prototype.svelte";

  const routes = {
    "/": ClassicKeyboard,
    "/prototype": Prototype
  };
</script>

<Router {routes} />
