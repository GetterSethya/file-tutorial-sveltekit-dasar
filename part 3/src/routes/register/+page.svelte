<script lang="ts">
	import { applyAction } from "$app/forms";
	import { responseToastEnum } from "$lib/myTypes/myTypes";
	import { toastData } from "$lib/store";
	import type { ActionData } from "./$types";
    import {enhance} from "$app/forms"
	import { goto } from "$app/navigation";


    export let form:ActionData;
    let waitingResult = false;
    $: toast = {
        message:form?.message,
        type:form?.type
    };
    
    $: $toastData = toast

</script>

<main class="w-1/3 items-center justify-evenly flex flex-col m-auto bg-slate-900 p-5 rounded border border-slate-800 text-slate-400 shadow-md">


    <h1 class="h3 my-2.5">Register</h1>
    <form use:enhance = {()=>{
        waitingResult = true;
        return async({result})=>{
            if(result.type == "redirect"){
                toast = {message:["Account created"], type: responseToastEnum.primary}
                $toastData = toast
                goto(result.location)
            }else{
                await applyAction(result)
            }
            waitingResult = false
        }
    }} action="?register" method="POST" class="flex flex-col w-full gap-2.5">
        <input type="text" class="input bg-slate-900 border-slate-800 rounded"
        name="username"
        id="username"
        placeholder="Username">
        
        <input type="text" class="input bg-slate-900 border-slate-800 rounded"
        name="name"
        id="name"
        placeholder="Your name">
        
        <input type="password" class="input bg-slate-900 border-slate-800 rounded"
        name="password"
        id="password"
        placeholder="password">
        
        <input type="password" class="input bg-slate-900 border-slate-800 rounded"
        name="confirm_password"
        id="confirm_password"
        placeholder="Confirm Password">
            <button type="submit" class="btn variant-ghost-primary mt-2.5 rounded text-white font-medium">Register</button>
    </form>

        <p class="my-2 5">
        <small>
            Already have an account?<a href="/login" class="mx-1.5 text-secondary-500">Login</a>
        </small>
    </p>
 
</main>

<style>
    input {
        height: 2.5em;
        padding-left: 1.5em;
    }

</style>
