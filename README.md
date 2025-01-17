# framer

## Running and using the server

```shell
npm run start
```

```shell
output="$( mktemp -d )/output.jpg"
curl http://localhost:3000/process-image \
  --request POST \
  --form "image=@demo/2000x2000.jpg" \
  --output "$output"
open "$output"
```
