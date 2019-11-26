require 'sinatra'
require 'json'

FILES='./files'

set :static, true
set :public_folder, FILES
set :port, 8808

CONF="#{FILES}/config.json"

post '/config.json' do
   b = request.body.read
   File.open(CONF,"w"){|f| f.puts b}
end