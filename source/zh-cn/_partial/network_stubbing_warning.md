{% note warning %}
请注意Cypress目前只支持拦截XMLHttpRequest。使用Fetch API和其他类型的网络请求如页面加载和`<script>`标签将不会被拦截或在命令日志中显示。更多详细信息和临时解决方案，请参见{% issue 95 %}。
{% endnote %}
