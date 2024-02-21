<!DOCTYPE html>
<html>
<head>
	<title>Role and Permission</title>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
	<link href='https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css' rel='stylesheet'>
    <link href="https://cdn.jsdelivr.net/gh/gitbrent/bootstrap4-toggle@3.6.1/css/bootstrap4-toggle.min.css" rel="stylesheet">
    <style type="text/css">
		body{
			background: #f9f9f9;
		}
		.card {
		  background-color: #ffffff;
		  -webkit-box-shadow: 1px 5px 24px 0 rgba(68, 102, 242, 0.05);
		          box-shadow: 1px 5px 24px 0 rgba(68, 102, 242, 0.05);
		  margin-bottom: 1.875rem;
		  transition: all .5s ease-in-out;
		  position: relative;
		  border: 0px solid transparent;
		  border-radius: 0.25rem;
		}
		.card .card-header {
		    background-color: #ffffff;
		    border-radius: 0;
		    margin: 25px;
		    padding: 0;
		    border-color: #eaeaea;
		    position: relative;
		    background: transparent;
		    display: flex;
		    justify-content: space-between;
		    align-items: center;
		    border: 0px;
		}
        ul{
            list-style:none;
        }
        ul li .btn{
            border-radius:0;
        }

	</style>
</head>
<body>
	<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
	  	<div class="container">
	  		<a class="navbar-brand" href="#">User Role Permission</a>
		  	<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
		    	<span class="navbar-toggler-icon"></span>
		  	</button>
		  	<div class="collapse navbar-collapse" id="navbarNavDropdown">
		    	<ul class="ml-auto navbar-nav">
		      		<li class="nav-item">
		        		<a class="nav-link" href="{{ url(config('permission.route_prefix').'/role') }}">Roles</a>
		      		</li>
		      		<li class="nav-item">
		        		<a class="nav-link" href="{{ url(config('permission.route_prefix').'/permission') }}">Permissions</a>
		      		</li>
		    	</ul>
		  	</div>
	  	</div>
	</nav>
	<div class="container mt-5">
		@yield('content')
	</div>


	<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/gh/gitbrent/bootstrap4-toggle@3.6.1/js/bootstrap4-toggle.min.js"></script>
</body>
</html>
