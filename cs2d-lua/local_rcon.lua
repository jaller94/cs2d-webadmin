local fake_stdin = io.open("stdin.stream", "r")

function local_rcon_test_input()
    if (fake_stdin:read(0)) then
        parse(fake_stdin:read("*l"))
    end
end

addhook("ms100", "local_rcon_test_input")
