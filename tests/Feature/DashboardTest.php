<?php

use App\Models\User;
use Spatie\Permission\Models\Role;

test('guests are redirected to the login page', function () {
    $this->get('/dashboard')->assertRedirect('/login');
});

test('authenticated users can visit the dashboard', function () {
    $this->actingAs($user = User::factory()->create());
    Role::findOrCreate('alumno');
    $user->assignRole('alumno');

    $this->get('/dashboard')->assertOk();
});
