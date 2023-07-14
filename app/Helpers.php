<?php

function generate_uuid()
{
    return str()->uuid();
}

function generate_url(string $path = null, string $disk = "public"): string
{
    return (!empty($path) && \Illuminate\Support\Facades\Storage::disk($disk)->exists($path))
        ? \Illuminate\Support\Facades\Storage::url($path)
        : 'https://via.placeholder.com/75/EBF4FF/7F9CF5?text=no%20image';
}
