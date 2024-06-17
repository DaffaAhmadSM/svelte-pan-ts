<script>
	import '../app.css';
import { ModeWatcher, toggleMode } from "mode-watcher";

</script>
<ModeWatcher />

<button on:click={toggleMode}>Toggle</button>
<slot/>
