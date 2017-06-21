#Include script


```js
<script type="text/javascript">
      var _noApp = {
        app_id: 'Supermanaaaaaaaaaaa'
      };
    </script>

    <script type="text/javascript">
      !function(){var a=document.createElement("script");a.async="true",a.src="dist/script.js";var b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b)}();
    </script>
```

Production deployment:
```
<!-- NOAPP -->
   <script type="text/javascript">
      var _noApp = {
        app_id: 'b88a0c1c-fc0e-4893-8835-50cb077effde'
      };
    </script>
    <script type="text/javascript">
      !function(){var a=document.createElement("script");a.async="true",a.src="//static-dev.noapp.io/script.js";var b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b)}();
    </script>
```

#Bundle the client

`webpack --progress --colors --display-modules  --watch`
