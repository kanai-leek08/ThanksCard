# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path
# Rails.application.config.assets.paths << Emoji.images_path

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
# Rails.application.config.assets.precompile += %w( search.js )
Rails.application.config.assets.precompile += [
    "normalize.css",
    "semantic.min.css",
    "jquery-ui.min.css",
    "jquery-1.8.2.min.js",
    "jquery-easing.js",
    "jquery-ui.js",
    "semantic.min.js",
    "vue.min.js",
    "vue-router.min.js"
]
