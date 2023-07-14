<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Register form</title>
    <link rel="stylesheet" href=" {{ asset('css/bootstrap.min.css') }}" crossorigin="anonymous">
</head>

<body>
    <div class="container" style="margin-top: 20px; width: 50%">
        <h2> Registration form</h2>
        <form method="POST" action="{{ route('postRegister') }}" enctype="multipart/form-data">
            @csrf
            @if (session('error'))
                <span class="text-danger">{{ session('error') }}</span>
            @endif

            <div class="form-outline mb-4">
                <input type="text" name="name" class="form-control" placeholder="Name"  autofocus   />
                @error('name')
                    <span class="text-danger">{{ $message }}</span>
                @enderror
            </div>

            <div class="form-outline mb-4">
                <input type="email" name="email" id="form2Example1" class="form-control"
                    placeholder="Email address" />
                @error('email')
                    <span class="text-danger">{{ $message }}</span>
                @enderror
            </div>


            <div class="form-outline mb-4">
                <input type="password" name="password" id="form2Example2" class="form-control" placeholder="Password" />
                @error('password')
                    <span class="text-danger">{{ $message }}</span>
                @enderror
            </div>


            <div class="form-outline mb-4">
                <input type="file" name="profile_photo" id="profile_photo" class="form-control"
                    placeholder="Profile Photo" accept="image/*" />
                @error('profile_photo')
                    <span class="text-danger">{{ $message }}</span>
                @enderror
            </div>

            <br>
            <button type="submit" class="btn btn-primary btn-block mb-4"> Register </button>
        </form>
    </div>
</body>

</html>
