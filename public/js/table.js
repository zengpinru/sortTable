Vue.component('v-table',{
	
	props:{
		
		data:{
			type:Array,
			default:function(){
				return [];
			}
		},
		
		columns:{
			type:Array,
			default:function(){
				return [];
			}
		},
		
	},
	
	data:function(){
		return {
			currentData:[],
			currentColums:[]
		};
	},
	
	methods:{
		
		/**
		 * 初始化表头数据
		 */
		makeColumns:function(){
			this.currentColums=this.columns.map(function(value,index){
				//添加一个字段标识当前的排序状态
				value._sortType='normal';
				//添加一个字段标识当前列在数组中的索引
				value._index=index;
				return value;
			});
		},
		
		/**
		 * 初始化行数据
		 */
		makeData:function(){
			this.currentData=this.data.map(function(value,index){
				value._index=index;
				return value;
			});
		},
		
		/**
		 * 
		 * @param {Number} index 需要排序字段的列的索引
		 */
		handleSortByAsc:function(index){
			var key=this.currentColums[index].key;
			//保证列与列之间排序互斥
			this.currentColums.forEach(function(col){
				col._sortType='normal';
			});
			this.currentColums[index]._sortType='asc';
			this.currentData.sort(function(a,b){
				return a[key]>b[key]?1:-1;
			});
		},
		
		/**
		 * 降序
		 * @param {Number} index 需要排序字段的列的索引
		 */
		handleSortByDesc:function(index){
			var key=this.currentColums[index].key;
			this.currentColums.forEach(function(col){
				col._sortType='normal';
			});
			this.currentColums[index]._sortType='desc';
			this.currentData.sort(function(a,b){
				return a[key]<b[key]?1:-1;
			});
		},
		
	},
	
	mounted:function(){
		//v-table是初始化
		this.makeData();
		this.makeColumns();
	},
	
	render:function(createElement){
		var _this=this;
		var ths=[];
		var trs=[];
		//创建表格的主体
		this.currentData.forEach(function(row){
			var tds=[];
			_this.currentColums.forEach(function(cell){
				tds.push(createElement('td',row[cell.key]));
			});
			trs.push(createElement('tr',tds));
		});
		//创建表格的头部
		this.currentColums.forEach(function(col,index){
			if(col.sortable){
				ths.push(createElement('th',[
					createElement('span',[col.title]),
					//升序
					createElement('a',{//数据对象
						class:{
							on:col._sortType==='asc'
						},
						on:{
							click:function(){
								_this.handleSortByAsc(index);
							}
						}
					},'on'),
					//降序
					createElement('a',{
						class:{
							off:col._sortType==='desc'
						},
						on:{
							click:function(){
								_this.handleSortByDesc(index);
							}
						}
					},'off')
				]));
			}else{
				ths.push(createElement('th',col.title));
			}
		});
		return createElement('table',[
			createElement('thead',[
				createElement('tr',ths)
			],),
			createElement('tbody',trs)
		]);
	},
	
	watch:{
		/**
		 * 如果增加或删除时，重新排序
		 */
		data:function(){
			this.makeData();
			var sortedColumn=this.currentColums.filter(function(col){
				return col._sortType!='normal';
			});
			if(sortedColumn.length>0){
				if(sortedColumn[0]._sortType=='asc'){
					this.handleSortByAsc(sortedColumn[0]._index);
				}else{
					this.handleSortByDesc(sortedColumn[0]._index);
				}
			}
		}
	},
	
});
var app=new Vue({
	el:'#app',
	data:{
		columns:[
			{
				title:'姓名',
				key:'name'
			},
			{
				title:'年龄',
				key:'age',
				sortable:true
			},
			{
				title:'生日',
				key:'birthday'
			},
			{
				title:'地址',
				key:'address'
			}
		],
		data:[
			{
				name:'王小明',
				age :12,
				birthday:'1999-02-21',
				address:'厦门'
			},
			{
				name:'王晓东',
				age :18,
				birthday:'2000-02-21',
				address:'广东'
			},
			{
				name:'李小刚',
				age :11,
				birthday:'2001-02-21',
				address:'广州'
			},
			{
				name:'李小玉',
				age :16,
				birthday:'2001-02-21',
				address:'广州'
			},
		]
	}
});