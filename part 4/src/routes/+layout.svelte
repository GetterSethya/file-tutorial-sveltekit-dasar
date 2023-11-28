<script lang="ts">
	import { responseToastEnum } from '$lib/myTypes/myTypes';
	import '../app.postcss';
    import {Toast, getToastStore} from "@skeletonlabs/skeleton";
    import {initializeStores} from "@skeletonlabs/skeleton";
    import type {ToastSettings} from "@skeletonlabs/skeleton";
    import {toastData} from "$lib/store"

    initializeStores();
    const toastStore = getToastStore()
    const t:ToastSettings = {
        message: "Custom toast",
        hoverable:true
    }

    let toastType:responseToastEnum|undefined = responseToastEnum.error;
    $: if($toastData.message) {
        $toastData.message.forEach((data)=>{
            toastStore.trigger({
                message:data,
                hoverable:true,
                background:`variant-ghost-${$toastData.type?$toastData.type:"error"}`
            })
        })
        toastType = $toastData.type
    }

</script>

<Toast position="br" background="variant-ghost-warning" color="text-white"/>
<div class="flex flex-col bg-slate-950 min-h-screen">
    <button class="text-white btn variant-filled-primary w-16" on:click={()=>{
        toastStore.trigger(t)
    }}>toast</button>
<slot />
</div>
