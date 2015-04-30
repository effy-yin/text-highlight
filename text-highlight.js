(function($) {

	'use strict';

	var anchorNode, focusNode;

	function TextHighlight() {
		var sel = window.getSelection(),			
			anchorOffset = sel.anchorOffset,
			focusOffset = sel.focusOffset;
			anchorNode = sel.anchorNode;
			focusNode = sel.focusNode;

		// anchorNode 和 focusNode 属于同一个文本节点
		if(anchorNode === focusNode) {

	        var tc = anchorNode.textContent;
	        var cs = tc.substring(0, anchorOffset);
	        var cm = tc.substring(anchorOffset, focusOffset);
	        var ce = tc.substring(focusOffset);
	        var newTc = cs+'<span style="background:yellow">'+ cm+'</span>'+ce;
	        $(anchorNode).replaceWith(newTc);	//////////////////	      
	    } 
	    // 跨标签高亮
	    else {
	    	
	    	// 分别获取 anchorNode 和 focusNode 祖先节点
			var anchorAncestors = findAncestorNodes(anchorNode);
		    var focusAncestors = findAncestorNodes(focusNode);
        

	        // 找到 anchorNode 和 focusNode 的第一个公共祖先节点
	        var indexA,indexF,isFind = false;
	        for(var i=0;i<anchorAncestors.length;i++) {
	            if(isFind) break;
	            for(var j=0;j<focusAncestors.length;j++) {
	                if(anchorAncestors[i]==focusAncestors[j]) {                    
	                    indexA=i;
	                    indexF=j;
	                    isFind = true;
	                    break;
	                }
	            }
	        }

	        // 对 anchorNode 所属子树以其祖先节点为分界对右侧节点进行高亮
	        for(var i=0;i<indexA-1;i++) {
	            highlightRightSiblings(anchorAncestors[i])
	        }

	        // 对 focusNode 所属子树以其祖先节点为分界对左侧节点进行高亮
	        for(var j=0;j<indexF-1;j++) {
	            highlightLeftSiblings(focusAncestors[j])
	        }
	        
	        // 对以公共祖先节点为根节点的中间子树进行高亮
	        var midRoot = anchorAncestors[indexA-1].nextSibling;
	        while(midRoot != null && midRoot != focusAncestors[indexF-1]) {
	            //对midRoot进行高亮时会改变其DOM结构，所以需在高亮前对其nextSibling节点进行缓存
	            var tmp = midRoot.nextSibling;
	            highLightNode(midRoot);
	            midRoot = tmp;
	        }

	        // 对 anchorNode 进行高亮
	        var tcA = anchorNode.textContent;  
	        var csA = tcA.substring(0,anchorOffset);
	        var ceA = tcA.substring(anchorOffset);
	        var newTcA = csA+'<span style="background:yellow">'+ ceA+'</span>';
	        $(anchorNode).replaceWith(newTcA);

	        // 对 focusNode 进行高亮
	        var tcF = focusNode.textContent;
	        var csF = tcF.substring(0,focusOffset);
	        var ceF = tcF.substring(focusOffset);
	        var newTcF = '<span style="background:yellow">'+ csF+'</span>'+ceF;   
	        $(focusNode).replaceWith(newTcF);
	        
	        // 跨标签高亮时需要手动取消焦点。。。为什么啊啊啊啊 
	        // bug： 选行数很多时 mouseup 之后不执行 textHight() - -||||
	        $('#key').focus();
	    }

	}


	// 获取一个节点的所有祖先节点
	function findAncestorNodes(node) {
	    var ancestors = [];
	    var cursor = node;
	    ancestors.push(cursor);
	    
	    while(cursor != document.body) {
	        cursor = cursor.parentNode;
	        ancestors.push(cursor);
	    }
	    return ancestors;
	}

	// 将一个节点及其所有右侧兄弟节点进行高亮
	function highlightRightSiblings(node) {
	    highLightNode(node); 
	    if(!node.nextSibling) {
	        return;
	    } else {
	        highlightRightSiblings(node.nextSibling);
	    }        
	}

	// 将一个节点及其所有左侧兄弟节点进行高亮
	function highlightLeftSiblings(node) {
	    highLightNode(node);    
	    if(!node.previousSibling) {
	        return;
	    } else {
	        highlightLeftSiblings(node.previousSibling);
	    }        
	}

	// 高亮节点的递归实现，如果是文本节点则直接高亮，如果是元素节点则将其所有文本子节点进行高亮
	function highLightNode(node) {
	    if(node.nodeType == 3 && 
	        /[^\n\r\s]/.test(node.nodeValue) &&	// 排除所有只包含回车、换行或空格的文本呢节点
	        node != anchorNode &&
	        node != focusNode) {
	        var span = document.createElement('span');
	        span.style.background = 'yellow';
	        $(node).wrap($(span));
	    }
	    if(node.nodeType == 1) {
	        var childNodes = node.childNodes;
	        if(childNodes.length>0) {
	            for(var i=0;i<childNodes.length;i++) {
	                highLightNode(childNodes[i])
	            }
	        }
	    }
	}

	window.TextHighlight = TextHighlight;

})(jQuery);
	




