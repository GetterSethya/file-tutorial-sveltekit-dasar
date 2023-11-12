<script>

</script>

<main class="w-1/3 items-center justify-evenly flex flex-col m-auto bg-slate-900 p-5 rounded border border-slate-800 text-slate-400 shadow-md">
    <h1 class="h3 my-2.5">Login</h1>
    <form action="?login" method="POST" class="flex flex-col w-full gap-2.5">
        <input type="text" class="input bg-slate-900 rounded border-slate-800"
        name="username" id="username" placeholder="Username">
        <input type="password" class="input bg-slate-900 rounded border-slate-800"
        name="password" id="password" placeholder="Password">
        <button class="btn variant-ghost-primary mt-2.5 text-white font-medium rounded" type="submit" >Login</button>
    </form>
        <p class="my-2.5">
        <small>Dont have an account?<a class="mx-1.5 text-secondary-500" href="/register">Register</a>

        </small>
    </p>
</main>


<style>
    input {
        height: 2.5em;
        padding-left: 1.5em;
    }

</style>
