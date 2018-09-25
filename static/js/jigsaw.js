(function($){
	function Jigsaw(options){
		this._init(options)
		this._initOrigin()
		this._initContent()
		this.Addstartevent()
		this.Renderoriginli()		
	}
	Jigsaw.prototype = {
		_init : function(options){
			var jigsaw = this
			jigsaw.options = {
				jOrigin : '.jigsaw_origin',
				images: [],
		        jContent : '.jigsaw_content',
		        rows : 4,
		        columns : 4,
		        imageIndex : 0,
		        jStart : '.jigsaw_start',
                emptyIndex: 8,//空区域的位置0-rows*column
		        deletIndex :8,//拿掉第几块图片0-rows*column
		        randomNum : 21,//初始随机次数
			}
			$.extend(true,jigsaw.options,options||{})
		},
		_initOrigin : function(){
			var jigsaw = this
			var jO = jigsaw.options.jOrigin
			var images = jigsaw.options.images
			for(var i = 0; i < images.length; i++){
				var $li = $('<li></li>')			
				$li[0].style.backgroundImage = 'url(' + images[i] +')'
				$li[0].index = i
				$li.click(function(){
					$(jigsaw.options.jOrigin+' ul'+' li').eq(jigsaw.options.imageIndex)[0].className = ''
					jigsaw.options.imageIndex = this.index
					jigsaw._initContent()
					jigsaw.Renderoriginli()
				})
				$(jO+' ul')[0].append($li[0])
			}
		},
		_initContent : function(){
			var jigsaw = this
			var r = jigsaw.options.rows
			var c = jigsaw.options.columns
			var jC = jigsaw.options.jContent
			var imgIndex = jigsaw.options.imageIndex
			var images = jigsaw.options.images
			$(jC+' span').css('display','none')
			var length = $(jC+' ul'+' li')? $(jC+' ul'+' li').length : 0
			for(var i = 0;i<r;i++){
				for(var j = 0; j<c;j++){
					if(length <i*r+j+1){
						var $li = $('<li></li>')
						//$li.css('background-image','url(img/'+imgIndex+'.jpg)')
						$li.css('background-position',-j*150+'px'+' -'+i*150+'px')
						$(jC+' ul')[0].append($li[0])
					}else{						
						//$(jC+' ul'+' li').eq(i*r+j).css('background-image','url(img/'+imgIndex+'.jpg)')
						$(jC+' ul'+' li').eq(i*r+j).css('background-position',-j*150+'px'+' -'+i*150+'px')
					}
				}
			}
			$(jC+' ul'+' li').css('background-image','url(' + images[imgIndex] + ')')
			$(jC+' ul'+' li').css('opacity','1.0')
		},
		Randomsort : function(){
			var jigsaw = this
			var r = jigsaw.options.rows
			var c = jigsaw.options.columns
			var jL = jigsaw.options.jContent +' ul'+' li'
			var dP = jigsaw.options.deletIndex
			var rN = jigsaw.options.randomNum
			var eP = jigsaw.options.emptyIndex
			var arr = []
			for(var i = 0;i<r;i++){
				for(var j = 0; j<c;j++){
					arr[i*r+j] = i*r+j
				}
			}
            arr.splice(dP,1)
            if(rN%2 == 0){
            	rN++
            }
            for(var i = 1;i<rN;i++){
            	var index = Math.floor(Math.random()*r*c)%15
            	var temporary = arr[index]
            	arr[index] = arr[(index+1)%15]
            	arr[(index+1)%15]= temporary 
            }
            arr.splice(eP,0,dP)
			$(jigsaw.options.jContent+' span').css('display','none')
			$(jL).css('opacity','1.0')
			for(var i = 0;i<r;i++){
				for(var j = 0; j<c;j++){
					var p = arr[i*r+j]
				    $(jL).eq(i*r+j).css('background-position',-p%c*150+'px'+' -'+Math.floor(p/r)*150+'px')
                    $(jL).eq(i*r+j)[0].index = p+1 
				}
			}
			$(jL).eq(eP).css('opacity','0.0')
		},
		Addstartevent : function(){
			var jigsaw = this
			var jS = jigsaw.options.jStart
			$(jS+' button').click(function(){
				jigsaw.Randomsort()
				jigsaw.Addmoveevent()
			})			
		},
		Addmoveevent : function(){
			var jigsaw = this
			var r = jigsaw.options.rows
			var c = jigsaw.options.columns
			var jL = jigsaw.options.jContent +' ul'+' li'
			var imgIndex = jigsaw.options.imageIndex
			for(var i = 0;i<r;i++){
				for(var j = 0; j<c;j++){
					if($(jL).eq(i*r+j).css('opacity') == 0.0){							
						if(i-1>=0){
							this.ClickMove(i,j,i-1,j)
						}
						if(i+1<4){
							this.ClickMove(i,j,i+1,j)
						}
						if(j-1>=0){
							this.ClickMove(i,j,i,j-1)
						}
						if(j+1<4){
							this.ClickMove(i,j,i,j+1)
						}
					}
				}
			} 
		},
		ClickMove : function(Oi,Oj,Ti,Tj){
			var jigsaw = this
			var r = jigsaw.options.rows
			var jL = jigsaw.options.jContent +' ul'+' li'
			$(jL).eq(Ti*r+Tj).css('cursor','pointer')
			$(jL).eq(Ti*r+Tj).bind('click',function(){
				jigsaw.Exchangelinode($(jL).eq(Oi*r+Oj),$(jL).eq(Ti*r+Tj))
				$(jL).eq(Oi*r+Oj).css('opacity','1.0')
				$(jL).eq(Ti*r+Tj).css('opacity','0.0')
				$(jL).css('cursor','')
				$(jL).unbind('click')
				if(!jigsaw.Judgefinish()){
					jigsaw.Addmoveevent()
				}else{
					$(jL).css('opacity','1.0')
					$(jigsaw.options.jContent+' span').css('display','block')
				}
			})
		},
		Exchangelinode : function(Node1,Node2){
			var liNode = Node1.css('background-position')
			var p = Node1[0].index
			Node1[0].index = Node2[0].index
			Node2[0].index = p
			Node1.css('background-position',Node2.css('background-position'))
			Node2.css('background-position',liNode)
		},
		Judgefinish : function(){
			var jigsaw = this
			var r = jigsaw.options.rows
			var c = jigsaw.options.columns
			var jL = jigsaw.options.jContent +' ul'+' li'
			for(var i = 0;i<r;i++){
				for(var j = 0; j<c;j++){
					console.log($(jL).eq(i*r+j)[0].index)
					if(i*r+j+1 != $(jL).eq(i*r+j)[0].index){
						return false
					}
				}
			}
			return true
		},
		Renderoriginli : function(){
			$(this.options.jOrigin+' ul'+' li').eq(this.options.imageIndex)[0].className = 'active'
		},
	}
	window.Jigsaw = Jigsaw
}(jQuery))