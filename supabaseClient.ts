import { createClient } from '@supabase/supabase-js'

// Vá para o painel do seu projeto no Supabase:
// Ícone de engrenagem (Settings) -> API
const supabaseUrl = 'https://ecymohnfoyddxtipmxyn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjeW1vaG5mb3lkZHh0aXBteHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5ODc1NjMsImV4cCI6MjA3MTU2MzU2M30.Ys7ZfZSoLj-rTyhFW696JrT8uTBrvzR66vkUQX3ANRU';

export const supabase = createClient(supabaseUrl, supabaseKey);