<script>
    let email = '';
    let password='';
    function login() {
        fetch(import.meta.env.VITE_API_URL + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*'
            },
            body: JSON.stringify({ email: email, password: password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                document.cookie = `token=${data.token}`;
                localStorage.setItem('menu', JSON.stringify(data.menu));
                window.location.href = '/dashboard';
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    </script>
    
    <div class="h-screen w-screen flex items-center justify-center">
        <div class="w-screen">
            <form class="max-w-sm mx-auto" method="POST">
                <div class="relative -mb-px h-px w-full bg-gradient-to-r from-transparent via-sky-300 to-transparent"></div>
                <div class="mb-5">
                <h1 class="text-4xl">Login</h1>
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                <input type="email" id="email" name="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="name@flowbite.com" required bind:value={email}/>
                </div>
                <div class="mb-5">
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900">Your password</label>
                <input type="password" name="password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required bind:value={password}/>
                </div>
                <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Submit</button>
            </form>
        </div>
    </div>