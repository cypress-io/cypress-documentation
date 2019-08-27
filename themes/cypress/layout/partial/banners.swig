<div class="top-banners">
	{% for banner in site.data.banners %}
		<div
			class="top-banners_item"
			data-id="{{ banner.id }}"
			data-start-date="{{ banner.startDate }}"
			data-end-date="{{ banner.endDate }}"
		>
			<div class="top-banners_item--body">
				{{ banner.text }}
			</div>

			<a
				class="top-banners_item--btn top-banners_item--btn-blue call-to-action"
				aria-label="about event"
				href="{{ banner.buttonLink }}"
			>
				{{ banner.buttonText || 'Get Started' }}
			</a>

			<button
				type="button"
				class="top-banners_item--btn-close"
				aria-label="close banner"
				title="close banner"
				data-id="{{ banner.id }}"
			>
				<i class="fa fa-times"></i>
			</button>
		</div>
	{% endfor %}
</div>
