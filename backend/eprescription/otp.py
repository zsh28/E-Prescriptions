import pyotp

uri = input("totp uri: ")
totp = pyotp.parse_uri(uri)
while True:
    print(totp.now())
    if not input("would you like another code? ").lower().startswith("y"):
        break

