angular.module('RouteControllers', [])
	.controller('HomeController', function($scope) {
		$scope.title = "Welcome To Angular Todo!"
	})
	.controller('RegisterController', function($scope, UserAPIService, store) {
		$scope.registrationUser = {};
        var URL = "https://morning-castle-91468.herokuapp.com/";

        $scope.login = function() {
            UserAPIService.callAPI(URL + "accounts/api-token-auth/", $scope.data).then(function(results) {
                $scope.token = results.data.token;
                store.set('username', $scope.registrationUser.username);
                store.set('authToken', $scope.token);
                $location.path('/todo');
            }).catch(function(err) {
                console.log(err);
            });
        }

		$scope.submitForm = function() {
            if ($scope.registrationForm.$valid) {
                $scope.registrationUser.username = $scope.user.username;
                $scope.registrationUser.password = $scope.user.password;

                UserAPIService.callAPI(URL + "accounts/register/", $scope.registrationUser).then(function(results) {
                    $scope.data = results.data;
                    alert("You have successfully registered to Angular Todo");
                    $scope.login();
                }).catch(function(err) {
                    console.log(err);
                    alert("Registration failed, please try again with another username.");
                });
            }
        };
    })
    .controller('LoginController', function($scope, $location, UserAPIService, store) {
        $scope.loginUser = {};
        var URL = "https://morning-castle-91468.herokuapp.com/";

        $scope.submitForm = function() {
            if ($scope.loginForm.$valid) {
                $scope.loginUser.username = $scope.user.username;
                $scope.loginUser.password = $scope.user.password;
                $scope.data={username: $scope.loginUser.username, password: $scope.loginUser.password};
                 UserAPIService.callAPI(URL + "accounts/api-token-auth/", $scope.data).then(function(results) {
                    console.log(results);
                    if(results.status>=400&&results.status<500)
                    {
                        alert(results.data.non_field_errors[0]);
                    }
                    $scope.token = results.data.token;
                    store.set('username', $scope.loginUser.username);
                    store.set('authToken', $scope.token);
                    $location.path('/todo');
                }).catch(function(err) {
                    console.log(err);
                });
            }
        };
    })
    .controller('LogoutController', function($scope, $location, store) {
        store.remove('username');
        store.remove('authToken'); 
        $location.path('/');
    })
    .controller('TodoController', function($scope, $location, TodoAPIService, store, $timeout) {
        if(!store.get('authToken'))
        {
            $location.path('/');
        }
        console.log($scope);
        // var id = $routeParams.id;
        var URL = "https://morning-castle-91468.herokuapp.com/";

        $scope.authToken = store.get('authToken');
        $scope.username = store.get('username');

        $scope.todos = [];

        TodoAPIService.getTodos(URL + "todo/", $scope.username, $scope.authToken).then(function(results) {
            $scope.todos = results.data;
            console.log($scope.todo);
        }).catch(function(err) {
            console.log(err);
        });

        $scope.clearTodo = function()
        {
            $scope.todo={};
        };

        $scope.submitForm = function() {
            // alert('create');
            if ($scope.todoForm.$valid) {
                $scope.todo.username = $scope.username;
                $scope.todos.push($scope.todo);
                console.log($scope.todo);
                TodoAPIService.createTodo(URL + "todo/", $scope.todo, $scope.authToken).then(function(results) {
                    console.log(results);
                    $scope.clearTodo();
                    $('#todo-modal').modal('hide');
                }).catch(function(err) {
                    console.log(err)
                });
            }
        };

        $scope.submitEditForm = function() 
        {
            // alert('Edit');
            console.log($scope);
            if ($scope.todoForm.$valid) {
                $scope.todo.username = $scope.username;

                TodoAPIService.editTodo(URL + "todo/" + $scope.todo.id, $scope.todo, store.authToken).then(function(results) {
                    console.log(results);
                    for(var i=0; i<$scope.todos.length; i++)
                    {
                        if($scope.todos[i].id===$scope.todo.id)
                        {
                            $scope.todos[i]=$scope.todo;
                        }
                    }
                    $scope.clearTodo();
                    $('#todo-edit-modal').modal('hide');
                }).catch(function(err) {
                    console.log(err);
                })
            }
        };
        $scope.editTodo = function(id) {
            // $location.path("/todo/edit/" + id);

            var URL = "https://morning-castle-91468.herokuapp.com/";

            TodoAPIService.getTodos(URL + "todo/" + id, $scope.username, store.authToken).then(function(results) {
                $scope.todo = results.data;
            }).catch(function(err) {
                console.log(err);
            });
        };

        $scope.deleteTodo = function(id) {
            var URL = "https://morning-castle-91468.herokuapp.com/";
            TodoAPIService.deleteTodo(URL + "todo/" + id, $scope.username, $scope.authToken).then(function(results) {
                console.log(results);
                for(var i=0; i<$scope.todos.length; i++)
                {
                    if($scope.todos[i].id===id)
                    {
                        $scope.todos.splice(i,1);
                    }
                }
            }).catch(function(err) {
                console.log(err);
            });
        };
    })

    /*.controller('EditTodoController', function($scope, $location, $routeParams, TodoAPIService, store) {
        var id = $routeParams.id;
        var URL = "https://morning-castle-91468.herokuapp.com/";

        TodoAPIService.getTodos(URL + "todo/" + id, $scope.username, store.get('authToken')).then(function(results) {
            $scope.todo = results.data;
        }).catch(function(err) {
            console.log(err);
        });

        $scope.submitForm = function() {
            if ($scope.todoForm.$valid) {
                $scope.todo.username = $scope.username;

                TodoAPIService.editTodo(URL + "todo/" + id, $scope.todo, store.get('authToken')).then(function(results) {
                    $location.path("/todo");
                }).catch(function(err) {
                    console.log(err);
                })
            }
        }
    })*/;
