@echo off
echo Installing PostgreSQL...
winget install PostgreSQL.PostgreSQL

echo Waiting for PostgreSQL to start...
timeout /t 30

echo Creating database and user...
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "CREATE DATABASE nbt_aloqa;"
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "CREATE USER nazoratchi_user WITH PASSWORD 'postgres';"
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE nbt_aloqa TO nazoratchi_user;"

echo PostgreSQL setup completed!
pause