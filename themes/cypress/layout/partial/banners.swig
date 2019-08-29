<div class="top-banners">
	{% for banner in site.data.banners %}
		<div
			class="top-banners-item"
			data-id="{{ banner.id }}"
			data-start-date="{{ banner.startDate }}"
			data-end-date="{{ banner.endDate }}"
		>
			<div class="top-banners-item__body">
				<div class="top-banners-item__body__text">
					{{ banner.text }}
				</div>

				<a
						class="top-banners-item__body__btn top-banners-item__body__btn_blue call-to-action"
						aria-label="about event"
						href="{{ banner.buttonLink }}"
				>
					{{ banner.buttonText || 'Get Started' }}
				</a>
			</div>

			<button
				type="button"
				class="top-banners-item__btn_close"
				aria-label="close banner"
				title="close banner"
				data-id="{{ banner.id }}"
			>
				<i class="fa fa-times"></i>
			</button>
		</div>
	{% endfor %}
</div>
