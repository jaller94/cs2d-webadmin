if webadmin==nil then webadmin={} end

addhook("join", "webadmin.join")
function webadmin.join(id)
    local bot = "f"
    if player(id, "bot") then bot = "t" end
    local name = player(id, "name")
    local ip = player(id, "ip")
    local port = player(id, "port")
    local usgn = player(id, "usgn")
    local steamid = player(id, "steamid")
    local msg = "WEBADM#JOIN#"..id.."#"..bot.."#"..name.."#"..ip.."#"..port
    msg = msg.."#"..usgn.."##"..steamid.."#"
    print(msg)
end

addhook("leave", "webadmin.leave")
function webadmin.leave(id)
    print("WEBADM#LEAVE#"..id)
end

print("WEBADM#INITIALIZE#PLAYERS")
