require "json"

Pod::Spec.new do |s|
  # NPM package specification
  package = JSON.parse(File.read(File.join(File.dirname(__FILE__), "package.json")))

  s.name         = "RNAuroraIMUI"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = "https://github.com/reactnativecomponent/react-native-imui"
  s.license      = "MIT"
  s.author       = { package["author"]["name"] => package["author"]["email"] }
  s.platforms    = { :ios => "9.0", :tvos => "9.0" }
  s.source       = { :git => "https://github.com/reactnativecomponent/react-native-imui", :tag => "#{s.version}" }
  #s.source_files = "ios/**/*.{h,m}"
  s.resource = 'ios/AuroraIMUI.bundle'
  s.dependency "React"
  s.vendored_frameworks = 'ios/RCTAuroraIMUI.framework'
  s.dependency 'SDWebImage', '~> 5.8'
  s.dependency 'SDWebImageWebPCoder', '~> 0.6.1'

end
