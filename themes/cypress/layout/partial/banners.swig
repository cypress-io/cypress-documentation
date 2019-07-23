<div class="top-banners">
	{% for banner in site.data.banners %}
		<div class="top-banners_item" data-start-date="{{ banner.startDate }}" data-end-date="{{ banner.endDate }}">
			<div class="top-banners_item--body">
				{{ banner.text }}
			</div>

			<a class="top-banners_item--btn top-banners_item--btn-blue call-to-action" href="{{ banner.buttonLink }}">
				{{ banner.buttonText || 'Get Started' }}
			</a>
		</div>
	{% endfor %}
</div>
