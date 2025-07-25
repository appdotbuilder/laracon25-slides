<?php

use Symfony\Component\Finder\Finder;

arch()->preset()->php()->ignoring(['dd', 'dump']);

arch()->preset()->laravel()->ignoring(['App\Http\Controllers\PresentationController']);
arch()->preset()->relaxed();
arch()->preset()->security()->ignoring(['array_rand', 'parse_str', 'mt_rand', 'uniqid', 'sha1']);

arch('annotations')
    ->expect('App')
    ->toUseStrictEquality()
    ->toHavePropertiesDocumented()
    ->toHaveMethodsDocumented();

// Allow PhpUnit tests in test directories
arch('tests follow naming convention')
    ->expect('Tests')
    ->toHaveSuffix('Test')
    ->ignoring('Tests\TestCase');
