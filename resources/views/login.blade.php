<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
        integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
</head>

<body>
    <div class="container" style="margin-top: 20px; width: 50%">
        <h2>Login</h2>
        <form method="POST" action="{{ route('checkLogin') }}">
            @csrf
            @if (session('error'))
                <span class="text-danger">{{ session('error') }}</span>
            @endif

            @if (session('success'))
                <span class="text-success">{{ session('success') }}</span>
            @endif

            <div class="form-outline mb-4">
                <input type="email" name="email" id="form2Example1" class="form-control"
                    placeholder="Email address" />
            </div>
            @error('email')
                <span class="text-danger">{{ $message }}</span>
            @enderror

            <div class="form-outline mb-4">
                <input type="password" name="password" id="form2Example2" class="form-control" placeholder="Password" />
            </div>
            @error('password')
                <span class="text-danger">{{ $message }}</span>
            @enderror
            <br>
            <!-- Submit button -->
            <button type="submit" class="btn btn-primary btn-block mb-4"> Sign in </button>
        </form>
    </div>
</body>

</html>
